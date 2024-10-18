using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Links.Base;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Core.Transfer;
using Itransition_Forms.Database.Contexts;
using Itransition_Forms.Dependencies.Database;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Itransition_Forms.Database.Repositories
{
    public class FillingsRepository : IFillingsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IFormsRepository _formsRepository;

        private delegate (AnswerLinkBase? result, string? error) GetAnswerDelegate(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer);

        public FillingsRepository(DatabaseContext context, IFormsRepository formsRepository)
        {
            _context = context;
            _formsRepository = formsRepository;
        }

        public async Task<FormLinkModel[]> GetByFormId(Guid formId, int from, int count)
        {
            return await _context.FormLinks
                .Where(x => x.FormModelId == formId)
                .OrderByDescending(x => x.Date)
                .Skip(from)
                .Take(count)
                .Include(x => x.Answers)
                .Include(x => x.User)
                .ToArrayAsync();
        }

        public async Task<Result> Create(Guid userId, Guid formId, FilledAnswerBase[] answers)
        {
            var form = await _formsRepository.GetFormModelById(formId);

            if (form == null)
                return Result.Failure("Form not found");

            var fillingOut = new FormLinkModel(userId, formId);
            var formAnswers = new List<AnswerBase>();

            form.Questions.ForEach(x => formAnswers.AddRange(x.Answers));
            form.IncrementNumberOfFills();

            foreach (var answer in answers)
            {
                var formAnswer = formAnswers.FirstOrDefault(x => x.Id == answer.AnswerId);
                var handler = GetConcreteClass(fillingOut.Id, answer, formAnswer);

                if (handler.IsSuccess)
                {
                    fillingOut.Answers.Add(handler.Value);
                }
            }

            _context.Update(form);

            await _context.AddAsync(fillingOut);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        private Result<AnswerLinkBase> GetConcreteClass(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            if (answer == null || baseAnswer == null)
                return Result.Failure<AnswerLinkBase>("Answer not found");

            Dictionary<GetAnswerDelegate, bool> types = new Dictionary<GetAnswerDelegate, bool>()
            {
                { GetTextboxAnswer, answer.Value.ValueKind == JsonValueKind.String },
                { GetRangeAnswer,answer.Value.ValueKind == JsonValueKind.Number },
                { GetCheckboxAnswer, answer.Value.ValueKind == JsonValueKind.True || answer.Value.ValueKind == JsonValueKind.False },
            };

            var type = types.FirstOrDefault(x => x.Value == true);
            var result = type.Key(fillingId, answer, baseAnswer);

            if (result.result == null || result.error != null)
                return Result.Failure<AnswerLinkBase>(result.error ?? "Something went wrong");

            return result.result;
        }

        private (AnswerLinkBase? result, string? error) GetRangeAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            var result = RangeBoxLinkModel.Create
            (
                baseAnswer as RangeBoxModel,
                answer.AnswerId,
                fillingId,
                answer.Value.GetUInt32()
            );

            if (result.IsFailure)
                return (null, result.Error);

            return (result.Value, null);
        }

        private (AnswerLinkBase? result, string? error) GetTextboxAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            var result = TextBoxLinkModel.Create
            (
                answer.AnswerId,
                fillingId,
                baseAnswer as TextBoxModel,
                answer.Value.GetString()
            );

            if (result.IsFailure)
                return (null, result.Error);

            return (result.Value, null);
        }

        private (AnswerLinkBase? result, string? error) GetCheckboxAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            var result = CheckBoxLinkModel.Create
            (
                answer.AnswerId,
                fillingId,
                answer.Value.GetBoolean()
            );

            if (result.IsFailure)
                return (null, result.Error);

            return (result.Value, null);
        }
    }
}