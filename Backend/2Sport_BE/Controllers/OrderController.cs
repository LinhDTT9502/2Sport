﻿using _2Sport_BE.Infrastructure.Services;
using _2Sport_BE.Repository.Models;
using _2Sport_BE.Service.Services;
using _2Sport_BE.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace _2Sport_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {

        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public OrderController(IOrderService orderService, IMapper mapper, IUserService userService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _userService = userService;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _orderService.GetOrdersAsync();
            return Ok(orders);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }
        // PUT: api/Orders/5
        [HttpPost("create-order")]
        public async Task<IActionResult> PostOrder([FromBody] OrderCM orderCM)
        {
            if (orderCM == null)
            {
                return BadRequest();
            }
            int userId =  GetCurrentUserIdFromToken();
            User user = await _userService.FindAsync(userId);
            var order = _mapper.Map<OrderCM, Order>(orderCM);
            order.UserId = userId;
            order.User = user;
            var result = await _orderService.AddOrderAsync(order);
            
            if (result == null)
            {
                return NotFound();
            }
            var orderVm = _mapper.Map<Order, OrderVM>(result);
            return Ok(orderVm);
        }
        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            var result = await _orderService.UpdateOrderAsync(order);

            if (!result)
            {
                return NotFound();
            }

            return Ok("Update successfully");
        }
        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return Ok("Delete successfully");
        }
        [NonAction]
        protected int GetCurrentUserIdFromToken()
        {
            int UserId = 0;
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var identity = HttpContext.User.Identity as ClaimsIdentity;
                    if (identity != null)
                    {
                        IEnumerable<Claim> claims = identity.Claims;
                        string strUserId = identity.FindFirst("UserId").Value;
                        int.TryParse(strUserId, out UserId);

                    }
                }
                return UserId;
            }
            catch
            {
                return UserId;
            }
        }
    }
}
