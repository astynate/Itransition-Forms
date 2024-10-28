using System.Drawing;

namespace Itransition_Forms.PreviewService
{
    public interface IDrawable
    {
        int Draw(int offsetTop, Graphics graphics);
    }
}