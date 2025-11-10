<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'f_name','m_name','l_name','suffix','date_of_birth','sex',
        'phone_number','email_address','address','position','status','department_id'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
