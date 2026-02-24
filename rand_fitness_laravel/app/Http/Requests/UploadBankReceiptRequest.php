<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadBankReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'bank_transfer_number' => 'required|string|max:100',
            'receipt' => 'required|image|max:5120|mimes:jpg,jpeg,png',
        ];
    }

    public function messages(): array
    {
        return [
            'bank_transfer_number.required' => 'رقم التحويل البنكي مطلوب',
            'bank_transfer_number.max' => 'رقم التحويل البنكي يجب ألا يتجاوز 100 حرف',
            'receipt.required' => 'صورة الإيصال مطلوبة',
            'receipt.image' => 'الملف يجب أن يكون صورة',
            'receipt.max' => 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت',
            'receipt.mimes' => 'صيغ الصور المدعومة: JPG, JPEG, PNG',
        ];
    }
}