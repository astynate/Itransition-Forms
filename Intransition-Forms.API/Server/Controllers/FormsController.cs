using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/forms")]
    public class FormsController : ControllerBase
    {
        public FormsController() 
        { 
        }

        [HttpPost]
        public async Task<IActionResult> NewForm()
        {

        }
    }
}