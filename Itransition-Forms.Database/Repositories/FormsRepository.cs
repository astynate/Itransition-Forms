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