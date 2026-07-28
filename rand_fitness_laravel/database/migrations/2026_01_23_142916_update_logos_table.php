<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLogosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
   public function up()
{
    Schema::table('logos', function (Blueprint $table) {
        // تعديل الأعمدة إذا كانت موجودة
        $table->string('file_name')->nullable()->change();
        $table->string('file_path')->nullable()->change();
        $table->string('file_type')->nullable()->change();
        $table->integer('file_size')->nullable()->change();
        $table->integer('width')->nullable()->change();
        $table->integer('height')->nullable()->change();
        $table->boolean('is_active')->default(true)->change();
        $table->unsignedBigInteger('uploaded_by')->nullable()->change();
        $table->softDeletes()->change();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('logos', function (Blueprint $table) {
            // حذف الحقول في حالة التراجع
            $table->dropColumn(['file_name', 'file_path', 'file_type', 'file_size', 'width', 'height', 'is_active', 'uploaded_by']);
            $table->dropSoftDeletes();
            $table->dropForeign(['uploaded_by']);
        });
    }
}
