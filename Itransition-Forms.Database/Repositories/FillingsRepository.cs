using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Links.Base;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Core.Transfer;
using Itransition_Forms.Database.Contexts;

namespace Itransition_Forms.Database.Repositories
{
    public class FillingsRepository
    {
        private readonly DatabaseContext _context;

        private readonly IFormsRepository _formsRepository;

        private delegate AnswerLinkBase GetAnswerDelegate(FilledAnswerBase answer, AnswerBase? baseAnswer);

        public FillingsRepository(DatabaseContext context, IFormsRepository formsRepository)
        {
            _context = context;
            _formsRepository = formsRepository;
        }

        public async Task<Result> Create(Guid userId, Guid formId, FilledAnswerBase[] answers)
        {
            var form = await _formsRepository.GetFormModelById(formId);

            if (form == null)
                return Result.Failure("Form not found");

            var fillingOut = new FormLinkModel(userId, formId);
            var formAnswers = new List<AnswerBase>();
            
            form.Questions.ForEach(x => formAnswers.AddRange(x.Answers));

            var result = new List<AnswerLinkBase>();

            foreach (var answer in answers)
            {
                var formAnswer = formAnswers.FirstOrDefault(x => x.Id == answer.AnswerId);
                var handler = GetConcreteClass(fillingOut.Id, answer, formAnswer);

                if (handler != null)
                {
                    result.Add(handler);
                }
            }

            await _context.AddRangeAsync();
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        private AnswerLinkBase? GetConcreteClass(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            if (answer == null || answer.Value == null || baseAnswer == null)
                return null;

            Dictionary<GetAnswerDelegate, bool> types = new Dictionary<GetAnswerDelegate, bool>()
            {
                { GetTextboxAnswer, answer.Value is string },
                { GetRangeAnswer, answer.Value is uint },
                { GetCheckboxAnswer, answer.Value is bool },
            };

            var type = types.FirstOrDefault(x => x.Value == true);
            var result = type.Key(fillingId, answer, baseAnswer);

            return result;
        }

        private RangeBoxLinkModel GetRangeAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {
            return RangeBoxLinkModel.Create
            (
                baseAnswer,
                answer.AnswerId,
                fillingId,
                answer.Value
            );
        }

        private TextBoxLinkModel GetTextboxAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {

        }

        private CheckBoxLinkModel GetCheckboxAnswer(Guid fillingId, FilledAnswerBase answer, AnswerBase? baseAnswer)
        {

        }
    }
}