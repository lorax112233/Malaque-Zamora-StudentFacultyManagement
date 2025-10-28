<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Shadrach Zamora',
            'email' => 'shadrachzamora@gmail.com',
            'password' => Hash::make('password123')
        ]);
    }
}