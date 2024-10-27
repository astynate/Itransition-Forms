using Itransition_Forms.Core.Answers;

namespace Itransition_Forms.Core.Form
{
    public class QuestionStatistic
    {
        public Guid QuestionId { get; init; }
        public AnswerStatistic[] Answers { get; init; } = [];

        private QuestionStatistic() { }

        public QuestionStatistic(Guid questionId, AnswerStatistic[] answers)
        {
            QuestionId = questionId;
            Answers = answers;
        }
    }
}