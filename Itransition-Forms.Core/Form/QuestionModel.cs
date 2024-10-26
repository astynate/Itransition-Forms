using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Form
{
    [Table("questions")]
    public class QuestionModel : IEquatable<QuestionModel>
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("question")] public string Question { get; private set; } = string.Empty;
        [Column("index")] public int Index { get; private set; } = 0;
        [Column("form_id")] public Guid FormModelId { get; private set; } = Guid.NewGuid();

        public List<AnswerBase> Answers { get; set; } = [];

        [NotMapped]
        [JsonIgnore]
        [ConcurrencyCheck]
        public Guid RowVersion { get; set; } = Guid.NewGuid();

        private QuestionModel() { }

        [JsonConstructor]
        private QuestionModel(Guid id, Guid formModelId, string question, int index)
        {
            Id = id;
            Question = question;
            Index = index;
            FormModelId = formModelId;
        }

        public static Result<QuestionModel> Create(string question, int index, Guid formId, List<AnswerBase> answers)
        {
            if (string.IsNullOrEmpty(question) || string.IsNullOrEmpty(question))
                return Result.Failure<QuestionModel>("Tag is required");

            if (formId == Guid.Empty)
                return Result.Failure<QuestionModel>("Form not found");

            if (answers.Count > 4)
                return Result.Failure<QuestionModel>("Invalid count of answers");

            if (index < 0)
                return Result.Failure<QuestionModel>("Invalid index");

            if (index > 100)
                return Result.Failure<QuestionModel>("You can add maximum 100 questions");

            for (int i = 0; i < answers.Count; i++)
            {
                for (int k = 0; i < answers.Count; k++)
                {
                    if (answers[i].GetType() != answers[k].GetType())
                    {
                        return Result.Failure<QuestionModel>("All answers should have the same type");
                    }
                }
            }

            return new QuestionModel()
            {
                Question = question,
                Answers = answers,
                Index = index
            };
        }

        public Result CloneProperties(QuestionModel other)
        {
            if (string.IsNullOrEmpty(other.Question) || (string.IsNullOrWhiteSpace(other.Question)))
                return Result.Failure("Question name is required");

            if (other.Index < 0 || other.Index > 100)
                return Result.Failure("Invalid index");

            Question = other.Question;
            Index = other.Index;

            return Result.Success();
        }

        public override int GetHashCode() => Id.GetHashCode();
        public bool Equals(QuestionModel? other) => other == null ? false : Id == other.Id;
        public void SortAnswersByIndex() => Answers = Answers.OrderBy(x => x.Index).ToList();

        public QuestionModel Clone()
        {
            Guid newId = Guid.NewGuid();

            return new QuestionModel()
            {
                Id = newId,
                Question = Question,
                Index = Index,
                Answers = Answers.Select(x => x.Clone(newId)).ToList()
            };
        }
    }
}