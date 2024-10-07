using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Database.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database.Repositories
{
    public class FormsRepository : IFormsRepository
    {
        private readonly DatabaseContext _context;

        public FormsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<FormModel>> CreateForm(string email)
        {
            var form = FormModel.Create("Form", "", Topics.Other, email);

            if (form.IsFailure) return form;

            await _context.AddAsync(form.Value);
            await _context.SaveChangesAsync();

            return form;
        }

        private async Task FillFormQuestions(FormModel form, List<QuestionModel> questions)
        {
            form.Questions = questions;

            foreach (var question in form.Questions)
            {
                question.Answers =
                [
                    .. await _context.TextBoxes
                        .Where(x => x.QuestionId == question.Id)
                        .ToListAsync(),

                    .. await _context.RangeBoxes
                        .Where(x => x.QuestionId == question.Id)
                        .ToListAsync(),

                    .. await _context.Checkboxes
                        .Where(x => x.QuestionId == question.Id)
                        .ToListAsync(),
                ];
            }
        }

        public async Task<Result<FormModel?>> GetFormModelById(Guid id)
        {
            var form = await _context.Forms
                .Where(x => x.Id == id)
                .GroupJoin(_context.Questions,
                    (form) => form.Id,
                    (question) => question.FormId,
                    (form, questions) => new
                    {
                        form,
                        questions
                    })
                .FirstOrDefaultAsync();

            if (form != null && form.form != null)
            {
                await FillFormQuestions(form.form, form.questions.ToList());
            }

            return form?.form;
        }

        public async Task<FormModel[]> GetPopularTemplates(int count)
        {
            var forms = await _context.Forms
                .OrderByDescending(x => x.NumberOfFills)
                .Take(count)
                .GroupJoin(_context.Questions,
                    (form) => form.Id,
                    (question) => question.FormId,
                    (form, questions) => new
                    {
                        form,
                        questions
                    })
                .ToListAsync();

            foreach (var form in forms)
            {
                await FillFormQuestions(form.form, form.questions.ToList());
            }

            return forms.Select(x => x.form).ToArray();
        }
    }
}