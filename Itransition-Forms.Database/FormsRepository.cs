using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database
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
                form.form.Questions = form.questions.ToList();

                foreach (var question in form.form.Questions)
                {
                    //question.Answers = _context.;
                }
            }

            return form?.form;
        }
    }
}