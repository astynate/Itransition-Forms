using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.User;
using Itransition_Forms.Database.Contexts;
using Itransition_Forms.Dependencies.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Net.Mail;

namespace Itransition_Forms.Database.Repositories
{
    public class FormsRepository : IFormsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IUsersRepository _usersRepository;

        private readonly ILogger<FormsRepository> _logger;

        public FormsRepository(DatabaseContext context, IUsersRepository usersRepository, ILogger<FormsRepository> logger)
        {
            _context = context;
            _usersRepository = usersRepository;
            _logger = logger;
        }

        public async Task<FormModel[]> GetFormModelsByPrefix(string prefix)
        {
            return await _context.Forms
                .Include(x => x.Owner)
                .Include(x => x.Tags)
                .Include(x => x.Questions)
                .ThenInclude(q => q.Answers)
                .Where(x => EF.Functions.IsMatch(x.Title, prefix, MySqlMatchSearchMode.Boolean) ||
                            EF.Functions.IsMatch(x.Description, prefix, MySqlMatchSearchMode.Boolean) ||
                            x.Questions.Any(q => EF.Functions.IsMatch(q.Question, prefix, MySqlMatchSearchMode.Boolean)))
                .AsSplitQuery()
                .ToArrayAsync();
        }

        private async Task<Result<FormModel>> CreateFormByCondition(Guid userId, Guid? templateReference)
        {
            if (templateReference != null)
            {
                var reference = await GetFormModelById(templateReference ?? Guid.Empty);

                if (reference == null)
                {
                    return Result.Failure<FormModel>("Reference not found");
                }

                return Result.Success(reference.Clone());
            }

            return FormModel.Create("Itransition Form", "", Topics.Other, userId);
        }

        public async Task<Result<FormModel>> CreateForm(Guid userId, Guid? templateReference)
        {
            var user = await _usersRepository.GetUserById(userId);

            if (user == null) 
                return Result.Failure<FormModel>("User not found");

            Result<FormModel> form = await CreateFormByCondition(userId, templateReference);

            if (form.IsFailure) return form;

            await _context.AddAsync(form.Value);
            await _context.SaveChangesAsync();

            form.Value.Owner = user; 

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
                .Include(x => x.Owner)
                .Include(x => x.Tags)
                .Include(x => x.UsersWithFillingOutAccess)
                .Include(x => x.Questions)
                    .ThenInclude(x => x.Answers)
                    .AsSplitQuery()
                    .ToArrayAsync();
        }

        public async Task<Result<FormModel[]>> GetUsersTemplates(Guid userId, int skip = 0, int count = 5) 
            => await GetFormByExpression((x) => x.UserModelId == userId, (x) => x.Date, skip, count);

        public async Task<FormModel[]> GetPopularTemplates(int count, string? tag)
        {
            if (string.IsNullOrEmpty(tag) || string.IsNullOrWhiteSpace(tag))
                return await GetFormByExpression((x) => true, (x) => x.NumberOfFills, 0, count);

            var result = await _context.Tags
                .Where(x => x.Tag == tag)
                .OrderBy(x => x.Id)
                .Take(5)
                .Include(x => x.Form)
                    .ThenInclude(form => form.Owner)
                .Include(x => x.Form)
                    .ThenInclude(form => form.Questions)
                        .ThenInclude(question => question.Answers)
                .AsSplitQuery()
                .Select(x => x.Form)
                .Where(x => x != null)
                .ToArrayAsync();

            return result ?? [];
        }

        public async Task<FormModel?> GetFormModelById(Guid id)
        {
            var form = await GetFormByExpression((x) => x.Id == id, (x) => x.Date, 0, 1);

            if (form.Length == 0) 
                return null;

            return form[0];
        }

        private async Task UpdateAnswers(QuestionModel prev, QuestionModel current)
        {
            var answersToAdd = current.Answers.Except(prev.Answers).ToArray();
            var answersToRemove = prev.Answers.Except(current.Answers).ToArray();

            var previousAnswersToUpdate = prev.Answers
                .Intersect(current.Answers)
                .OrderBy(x => x.Index)
                .ToArray();

            var newAnswersToUpdate = current.Answers
                .Intersect(prev.Answers)
                .OrderBy(x => x.Index)
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

            var previousQuestionsToUpdate = form.Questions
                .Intersect(updatedForm.Questions)
                .OrderBy(x => x.Index)
                .ToArray();

            var newQuestionsToUpdate = updatedForm.Questions
                .Intersect(form.Questions)
                .OrderBy(x => x.Index)
                .ToArray();

            for (int i = 0; i < previousQuestionsToUpdate.Count(); i++)
            {
                previousQuestionsToUpdate[i].CloneProperties(newQuestionsToUpdate[i]);
                await UpdateAnswers(previousQuestionsToUpdate[i], newQuestionsToUpdate[i]);
            }

            _context.UpdateRange(previousQuestionsToUpdate);
            _context.RemoveRange(questionsToRemove);

            await _context.AddRangeAsync(questionsToAdd);
            await _context.SaveChangesAsync();
        }

        private async Task UpdateTags(FormModel form, FormModel updatedForm)
        {
            var formTags = form.Tags.Select(x => x.Tag);

            var tagsToAdd = updatedForm.Tags.Except(form.Tags).Where(x => formTags.Contains(x.Tag) == false);
            var tagsToRemove = form.Tags.Except(updatedForm.Tags);

            _context.RemoveRange(tagsToRemove);

            await _context.AddRangeAsync(tagsToAdd);
            await _context.SaveChangesAsync();
        }

        private async Task UpdateUsers(FormModel form, FormModel updatedForm)
        {
            var usersToAdd = updatedForm
                .UsersWithFillingOutAccess
                .Except(form.UsersWithFillingOutAccess);

            var usersToRemove = form
                .UsersWithFillingOutAccess
                .Except(updatedForm.UsersWithFillingOutAccess);

            var usersToRemoveList = new List<UserModel>();

            foreach (var user in usersToRemove)
            {
                var specificUser = form.UsersWithFillingOutAccess
                    .FirstOrDefault(x => x.Id == user.Id);

                if (specificUser != null)
                {
                    _context.Attach(specificUser);
                    usersToRemoveList.Add(specificUser); 
                }
            }

            foreach (var userToRemove in usersToRemoveList)
            {
                form.UsersWithFillingOutAccess.Remove(userToRemove);
            }

            foreach (var user in usersToAdd)
            {
                if (user.Id != form.UserModelId && form.UsersWithFillingOutAccess.Contains(user) == false)
                {
                    _context.Attach(user);
                    form.UsersWithFillingOutAccess.Add(user);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<Result> UpdateForm(FormModel form, FormModel updatedForm)
        {
            var result = form.CopyParams(updatedForm);

            if (result.IsFailure)
                return result;

            var executionStrategy = _context.Database.CreateExecutionStrategy();

            return await executionStrategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        _context.Forms.Update(form);

                        await UpdateTags(form, updatedForm);
                        await UpdateUsers(form, updatedForm);
                        await UpdateQuestions(form, updatedForm);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        return Result.Success();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.Message);
                        return Result.Failure("Form has not be saved");
                    }
                }
            });
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

        public async Task<bool> Delete(Guid id, Guid userId, bool checkOwner)
        {
            var result = await _context.Forms
                .Where(x => x.Id == id && (checkOwner ? userId == x.UserModelId : true))
                .ExecuteDeleteAsync();

            return result > 0;
        }
    }
}