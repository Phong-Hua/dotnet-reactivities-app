using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // controller is a place holder and get replaced by whatever the controller 
    //lastname is minus the word controller
    public class BaseApiController : ControllerBase
    {
        
    }
}