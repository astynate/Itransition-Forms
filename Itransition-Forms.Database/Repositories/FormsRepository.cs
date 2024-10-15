using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Database.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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
            var form = FormModel.Create("Itransition Form", "", Topics.Other, email);

            if (form.IsFailure) return form;

            await _context.AddAsync(form.Value);
            await _context.SaveChangesAsync();

            return form;
        }

        private async Task<FormModel[]> GetFormByExpression
        (
            Expression<Func<FormModel, bool>> predicate, 
            Expression<Func<FormModel, object>> sort, 
            int skip, 
            int count
        )
        {
            return await _context.Forms
                .OrderByDescending(sort)
                .Where(predicate)
                .Skip(skip)
                .Take(count)
                .Include(x => x.Questions)
                    .ThenInclude(x => x.Answers)
                    .AsSplitQuery()
                    .ToArrayAsync();
        }

        public async Task<Result<FormModel[]>> GetUsersTemplates(string email, int skip = 0, int count = 5) 
            => await GetFormByExpression((x) => x.OwnerEmail == email, (x) => x.Date, skip, count);

        public async Task<FormModel[]> GetPopularTemplates(int count)
            => await GetFormByExpression((x) => true, (x) => x.NumberOfFills, 0, count);

        public async Task<FormModel?> GetFormModelById(Guid id)
        {
            var form = await GetFormByExpression((x) => x.Id == id, (x) => x.Date, 0, 1);

            if (form.Length == 0) 
                return null;

            return form[0];
        }

        private async Task UpdateQuestion(QuestionModel prev, QuestionModel current)
        {
            var answersToAdd = prev.Answers.Except(current.Answers);
            var answersToRemove = current.Answers.Except(prev.Answers);

            var previousAnswersToUpdate = current.Answers
                .Intersect(prev.Answers)
                .ToArray();

            var newAnswersToUpdate = current.Answers
                .Intersect(prev.Answers)
                .ToArray();

            for (int i = 0; i < previousAnswersToUpdate.Length; i++)
            {
                previousAnswersToUpdate[i].Clone(newAnswersToUpdate[i]);
            }

            _context.UpdateRange(previousAnswersToUpdate);
            _context.RemoveRange(answersToRemove);

            await _context.AddRangeAsync(answersToAdd);
            await _context.SaveChangesAsync();
        }

        private async Task UpdateQuestions(FormModel form, FormModel updatedForm)
        {
            var questionsToAdd = updatedForm.Questions.Except(form.Questions);
            var questionsToRemove = form.Questions.Except(updatedForm.Questions);

            var previousQuestionsToUpdate = updatedForm.Questions
                .Intersect(form.Questions)
                .ToArray();

            var newQuestionsToUpdate = form.Questions
                .Intersect(updatedForm.Questions)
                .ToArray();

            for (int i = 0; i < previousQuestionsToUpdate.Count(); i++)
            {
                previousQuestionsToUpdate[i].CloneProperties(newQuestionsToUpdate[i]);
                await UpdateQuestion(previousQuestionsToUpdate[i], newQuestionsToUpdate[i]);
            }

            _context.UpdateRange(previousQuestionsToUpdate);
            _context.RemoveRange(questionsToRemove);

            await _context.AddRangeAsync(questionsToAdd);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> UpdateForm(FormModel form, FormModel updatedForm)
        {
            var result = form.CopyParams(updatedForm);

            if (result.IsFailure) 
                return result;

            _context.Forms.Update(form);

            await UpdateQuestions(form, updatedForm);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> UpdateFormTitle(FormModel form, string title)
        {
            var result = form.UpdateTitle(title);

            if (result.IsFailure)
                return result;

            _context.Forms.Update(form);
            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<bool> Delete(Guid id, string? email, bool checkOwner)
        {
            var result = await _context.Forms
                .Where(x => x.Id == id && (checkOwner ? email == x.OwnerEmail : true))
                .ExecuteDeleteAsync();

            return result > 0;
        }
    }
}