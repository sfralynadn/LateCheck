<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $result = [
            'id' => $this->id,
            "email" => $this->email,
            "last_logged_in" => $this->last_logged_in,
            "role" => $this->role,
            "profile" => [
                "name" => $this->profile->name,
                "address" => $this->profile->address,
                "classroom" => $this->profile->classroom,
            ]
        ];

        if ($this->role === 'TEACHER') {
            $result['profile']['nip'] = $this->profile->nip;
        } elseif ($this->role === 'STUDENT') {
            $result['profile']['nis'] = $this->profile->nis;
        }

        return $result;
    }
}
