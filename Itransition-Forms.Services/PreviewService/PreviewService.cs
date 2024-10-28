using Itransition_Forms.Core.Form;
using System.Drawing;

namespace Itransition_Forms.PreviewService
{
    public class PreviewService : IPreviewService
    {
        private void UpdateFormPreview(FormModel form, Bitmap bmp)
        {
            using (var stream = new MemoryStream())
            {
                bmp.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                form.Preview = Convert.ToBase64String(stream.ToArray());
            }
        }

        public void DrawPreviewImage(FormModel form)
        {
            using (var bmp = new Bitmap(DrawingConfiguration.Width, DrawingConfiguration.Height))
            {
                using (Graphics graphics = Graphics.FromImage(bmp))
                {
                    graphics.Clear(DrawingConfiguration.Background);

                    int offsetTop = new TitlePreview(form.Title, form.Description).Draw(0, graphics);

                    foreach (var question in form.Questions.OrderBy(x => x.Index))
                    {
                        offsetTop = new QuestionPreview(question).Draw(offsetTop, graphics);
                    }
                }

                UpdateFormPreview(form, bmp);
            }
        }
    }
}