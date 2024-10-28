using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Form;
using System.Drawing;

namespace Itransition_Forms.PreviewService
{
    public class QuestionPreview : IDrawable
    {
        public QuestionModel ReferencedQuestion { get; init; } = null!;

        public QuestionPreview(QuestionModel referencedQuestion)
        {
            ReferencedQuestion = referencedQuestion;
        }

        private int DrawCheckbox(int offsetTop, int offsetLeft, Graphics graphics, string text)
        {
            int squareSize = 10;
            int borderSize = 1;

            using (Pen borderPen = new Pen(Color.Black, borderSize))
            {
                graphics.DrawRectangle
                (
                    borderPen,
                    offsetLeft,
                    offsetTop - borderSize,
                    squareSize + borderSize * 2,
                    squareSize + borderSize * 2
                );
            }

            using (Font font = new Font("Arial", 9))
            {
                graphics.DrawString(text, font, Brushes.Black, squareSize + 5 + offsetLeft, offsetTop - borderSize);
            }

            return offsetTop + 20;
        }

        private int DrawTextbox(int offsetTop, int offsetLeft, Graphics graphics)
        {
            using (Pen borderPen = new Pen(Color.Black, 1))
            {
                graphics.DrawRectangle
                (
                    borderPen,
                    offsetLeft,
                    offsetTop,
                    270,
                    1
                );
            }

            return offsetTop + 20;
        }

        public int Draw(int offsetTop, Graphics graphics)
        {
            var questionFontSize = 12;
            var questionFont = new Font("Arial", questionFontSize, FontStyle.Bold);

            var width = 300;
            var height = questionFontSize + (ReferencedQuestion.Answers.Count() * 20) + 30;
            var offsetX = (DrawingConfiguration.Width - width) / 2;
            var offsetY = offsetTop + 5;

            graphics.FillRectangle(Brushes.White, offsetX, offsetY, width, height);
            graphics.DrawString(ReferencedQuestion.Question, questionFont, Brushes.Black, offsetX + 10, offsetY + 10);

            var answerOffestTop = offsetY + questionFontSize + 25;

            foreach (var answer in ReferencedQuestion.Answers.OrderBy(x => x.Index))
            {
                answerOffestTop = answer is CheckBoxModel ckeckbox ? DrawCheckbox(answerOffestTop, offsetX + 15, graphics, ckeckbox.Title) : 
                    DrawTextbox(answerOffestTop, offsetX + 15, graphics);
            }

            return height + offsetY;
        }
    }
}