<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('documents', function (Blueprint $table) {
      $table->id();
      $table->timestamps();
      $table->string('name');
      $table->string('issuing_authority')->nullable();
      $table->date('date_issued')->required();
      $table->date('date_expired')->required();
      $table->string('attachment')->nullable();
      $table->string('remarks')->nullable();
      $table->date('last_sent_email')->nullable();
      $table->boolean('is_active')->default(1);

      $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
      $table->foreignId('created_by')->nullable()->contrained('users')->onDelete('set null');
      $table->foreignId('updated_by')->nullable()->contrained('users')->onDelete('set null');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('documents');
  }
};
