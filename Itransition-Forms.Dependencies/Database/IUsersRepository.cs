﻿using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;

namespace Itransition_Forms.Dependencies.Database
{
    public interface IUsersRepository
    {
        Task<UserModel?> GetUserById(Guid id);
        Task<Result<UserModel>> Login(string email, string password);
        Task<Result<UserModel>> Register(string email, string password, int color);
    }
}