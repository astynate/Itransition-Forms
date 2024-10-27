using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.Links.Base;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Database.Contexts;
using System.Data.Entity;

namespace Itransition_Forms.Database.Repositories
{
    public class StatisticRepository : IStatisticRepository
    {
        private readonly DatabaseContext _context;

        public StatisticRepository(DatabaseContext context)
        {
            _context = context;
        }

        private object GetSpecificValue(AnswerLinkBase answer)
            => answer is CheckBoxLinkModel checkBoxAnswer ? checkBoxAnswer.Value :
               answer is RangeBoxLinkModel rangeBoxAnswer ? rangeBoxAnswer.Value :
               answer is TextBoxLinkModel textBoxAnswer ? textBoxAnswer.Value :
               answer.Id;

        public async Task<QuestionStatistic[]> GetQuestionStatistic(Guid formId)
        {
            var answers = _context.FormLinks
                .Where(x => x.FormModelId == formId)
                .Include(x => x.Answers)
                .SelectMany(x => x.Answers)
                .ToList();

            return answers
                .GroupBy(answer => new
                {
                    answer.QuestionId,
                    Value = GetSpecificValue(answer)
                })
                .Select(group => new QuestionStatistic(
                    group.Key.QuestionId,
                    group.Select(x => new AnswerStatistic(group.Key.Value, group.Count())).ToArray()
                ))
                .OrderByDescending(x => x.Answers.Length)
                .Take(5)
                .ToArray();
        }
    }
}