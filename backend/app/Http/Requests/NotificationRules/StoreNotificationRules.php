
<?php

namespace App\Http\Requests\NotificationRules;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\TimeUnit;
use App\Enums\Frequency;

class StoreNotificationRules extends FormRequest
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
      'notify_before'      => 'required|numeric',
      'time_unit'     => ['required', new Enum(TimeUnit::class)],
      'frequency'       => ['required', new Enum(Frequency::class)],
      'document_id'      => 'sometimes|exists:documents,id',
    ];
  }
}
