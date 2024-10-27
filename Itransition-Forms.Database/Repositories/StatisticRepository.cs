using CSharpFunctionalExtensions;
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
            => answer is CheckBoxLinkModel checkBoxAnswer ? checkBoxAnswer.Id :
               answer is RangeBoxLinkModel rangeBoxAnswer ? rangeBoxAnswer.Value :
               answer is TextBoxLinkModel textBoxAnswer ? textBoxAnswer.Value :
               answer.Id;

        public async Task<object[]> GetQuestionStatistic(Guid formId)
        {
            var answers = _context.FormLinks
                .Where(x => x.FormModelId == formId)
                .Include(x => x.Answers)
                .SelectMany(x => x.Answers)
                .ToList();

            return answers
                .GroupBy(answer => answer.QuestionId)
                .Select(group => new
                {
                    QuestionId = group.Key,
                    Answers = group
                        .GroupBy(answer => GetSpecificValue(answer))
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => new
                        { 
                            Value = g.Key,
                            Count = g.Count(),
                            Answer = g.FirstOrDefault()
                        })
                        .ToArray()
                })
                .ToArray();
        }
    }
}