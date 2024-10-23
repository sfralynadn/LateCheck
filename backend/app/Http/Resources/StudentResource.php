<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nis' => $this->nis,
            'name' => $this->name,
            'contact' => $this->contact,
            'gender' => $this->gender,
            'classroom' => [
                'id' => $this->classroom->id,
                'name' => $this->classroom->name
            ],
            'address' => $this->address,
        ];
    }
}
