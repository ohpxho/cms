<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\TimeUnit;
use App\Enums\Frequency;


return new class () extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('notification_rules', function (Blueprint $table) {
      $table->id();
      $table->timestamps();
      $table->integer('notify_before');
      $table->enum('time_unit', array_column(TimeUnit::cases(), 'value'));
      $table->enum('frequency', array_column(Frequency::cases(), 'value'));

      $table->foreignId('document_id')->nullable()->constrained('documents')->onDelete('set null');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('notification_rules');
  }
};
