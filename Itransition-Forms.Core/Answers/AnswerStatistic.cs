namespace Itransition_Forms.Core.Answers
{
    public class AnswerStatistic
    {
        public object Value { get; set; } = null!;
        public int Count { get; set; } = 0;
        //public Guid AnswerId { get; set; }

        private AnswerStatistic() { }

        public AnswerStatistic(object value, int count) 
        { 
            Value = value;
            Count = count;
            //AnswerId = answerId;
        }
    }
}