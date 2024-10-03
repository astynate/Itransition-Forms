using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;

namespace Itransition_Forms.Core.Form
{
    public class QuestionModel
    {
        public string Question { get; private set; } = string.Empty;
        public List<AnswerBase> Answers { get; private set; } = [];

        private QuestionModel() { }

        public static Result<QuestionModel> Create(string question, List<AnswerBase> answers)
        {
            if (string.IsNullOrEmpty(question) || string.IsNullOrEmpty(question))
            {
                return Result.Failure<QuestionModel>("Name is required");
            }

            if (answers.Count > 7)
            {
                return Result.Failure<QuestionModel>("Invalid count of answers");
            }

            for (int i = 0; i < answers.Count; i++)
            {
                for (int k = 0; k < answers.Count; k++)
                {
                    if (answers[i].GetType() != answers[k].GetType())
                    {
                        return Result.Failure<QuestionModel>("All your answers must have the same type");
                    }
                }
            }

            return new QuestionModel()
            {
                Question = question,
                Answers = answers
            };
        }
    }
}