<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
          'name'             => 'required|string|max:255',
          'issuing_authority'=> 'nullable|string|max:255',
          'date_issued'      => 'required|date',
          'date_expired'     => 'required|date|after_or_equal:date_issued',
          'attachment'       => 'sometimes|file|max:10240', // Or 'file|mimes:pdf,jpg,...' if it's a file
          'remarks'          => 'nullable|string|max:255',
          'last_sent_email'  => 'nullable|date',
          'category_id'      => 'required|exists:categories,id',
        ];
    }
}
