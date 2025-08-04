<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_rules', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('notify_before');
            $table->enum('time_unit', ['Day', 'Week', 'Month']);
            $table->enum('frequency', ['Once', 'Everyday', 'Every Other Day', 'Twice']);

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
