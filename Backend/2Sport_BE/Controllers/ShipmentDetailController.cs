﻿using _2Sport_BE.Infrastructure.Services;
using _2Sport_BE.Repository.Models;
using _2Sport_BE.Service.Services;
using _2Sport_BE.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace _2Shipment_BE.Controllers
{
    public class ShipmentDetailController : Controller
    {
        private readonly IShipmentDetailService _shipmentDetailService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public ShipmentDetailController(IShipmentDetailService shipmentDetailService, IMapper mapper, IUserService userService)
        {
            _shipmentDetailService = shipmentDetailService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpGet]
        [Route("list-shipment-details")]
        public async Task<IActionResult> GetShipmentDetails()
        {
            try
            {
                var query = await _shipmentDetailService.GetAllShipmentDetails(GetCurrentUserIdFromToken());
                var shipments = query.Select(_ => _mapper.Map<ShipmentDetail, ShipmentDetailVM>(_)).ToList();
                if (shipments.Count > 0)
                {
                return Ok(shipments);
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("add-many-shipment-details")]
        public async Task<IActionResult> AddShipments(List<ShipmentDetail> newShipments)
        {
            try
            {
                await _shipmentDetailService.AddShipmentDetails(newShipments);
                return Ok("Add new Shipment Details successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpPost]
        [Route("add-shipment-detail")]
        public async Task<IActionResult> AddShipment([FromBody]ShipmentDetailCM shipmentDetailCM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request data");
            }
            var userId = GetCurrentUserIdFromToken();
            if(userId == null)
            {
                return BadRequest("Invalid user");
            }
            try
            {
                var newShipmentDetail = new ShipmentDetail()
                {
                    PhoneNumber = shipmentDetailCM.PhoneNumber,
                    Address = shipmentDetailCM.Address,
                    FullName = shipmentDetailCM.FullName,
                    UserId = userId
                };
                await _shipmentDetailService.AddShipmentDetail(newShipmentDetail);

                ShipmentDetailVM detailVM = new ShipmentDetailVM()
                {
                    FullName = shipmentDetailCM.FullName,
                    Address = shipmentDetailCM.Address,
                    PhoneNumber = shipmentDetailCM.PhoneNumber,
                    UserId = userId
                   
                };
                return Ok("Query successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpPut]
        [Route("update-shipment-detail/{id}")]
        public async Task<IActionResult> UpdateShipment(int id, [FromBody]ShipmentDetailUM shipmentDetailUM)
        {
            try
            {
                var checkExist = await _shipmentDetailService.GetShipmentDetailById(id);
                var userId = GetCurrentUserIdFromToken();
                if (userId == null || checkExist == null)
                {
                    return BadRequest("Invalid request data or user!");
                }
                if (checkExist != null)
                {
                    checkExist.FullName = shipmentDetailUM.FullName;
                    checkExist.PhoneNumber = shipmentDetailUM.PhoneNumber;
                    checkExist.Address = shipmentDetailUM.Address;

                    await _shipmentDetailService.UpdateShipmentDetail(checkExist);
                    ShipmentDetailVM detailVM = new ShipmentDetailVM()
                    {
                        Id = checkExist.Id,
                        FullName = shipmentDetailUM.FullName,
                        Address = shipmentDetailUM.Address,
                        PhoneNumber = shipmentDetailUM.PhoneNumber,
                        UserId = userId
                    };
                    return Ok(detailVM);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete]
        [Route("delete-shipment-detail")]
        public async Task<IActionResult> DeleteShipment(int id)
        {
            try
            {
                await _shipmentDetailService.DeleteShipmentDetailById(id);
                return Ok("Removed successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
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
        [NonAction]
        private async Task<User> GetUserFromToken()
        {
            var user = await _userService.GetAsync(_ => _.Id == GetCurrentUserIdFromToken());
            return user.FirstOrDefault();
        }
    }
}