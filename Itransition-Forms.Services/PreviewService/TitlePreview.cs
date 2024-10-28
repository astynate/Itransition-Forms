using System.Drawing;

namespace Itransition_Forms.PreviewService
{
    public class TitlePreview : IDrawable
    {
        public string Title { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;

        public TitlePreview(string title, string description)
        {
            Title = title;
            Description = description;
        }

        public int Draw(int offsetTop, Graphics graphics)
        {
            var titleFontSize = 14;
            var descriptionFontSize = 12;

            var titleFont = new Font("Arial", titleFontSize, FontStyle.Bold);
            var descriptionFont = new Font("Arial", descriptionFontSize);

            var width = 300;
            var height = Description.Split("<div>").Length * descriptionFontSize + titleFontSize + 35;
            var offsetX = (DrawingConfiguration.Width - width) / 2;
            var offsetY = 20;

            graphics.FillRectangle(Brushes.White, offsetX, offsetY, width, height);

            graphics.DrawString(Title, titleFont, Brushes.Black, offsetX + 10, offsetY + 10);
            graphics.DrawString(Description, descriptionFont, Brushes.Black, offsetX + 10, offsetY + 35);

            return height + offsetY;
        }
    }
}