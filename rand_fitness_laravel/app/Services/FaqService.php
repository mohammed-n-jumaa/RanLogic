<?php

namespace App\Services;

use App\Models\FaqSection;
use App\Models\FaqQuestionAr;
use App\Models\FaqQuestionEn;
use App\Models\UserQuestion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FaqService
{
    /**
     * Get FAQ section settings
     */
    public function getSection()
    {
        return FaqSection::first();
    }

    /**
     * Get all Arabic questions
     */
    public function getArabicQuestions()
    {
        return FaqQuestionAr::ordered()->get();
    }

    /**
     * Get all English questions
     */
    public function getEnglishQuestions()
    {
        return FaqQuestionEn::ordered()->get();
    }

    /**
     * Get user questions
     */
    public function getUserQuestions()
    {
        return UserQuestion::recent()->get();
    }

    /**
     * Get FAQ data for admin
     */
    public function getAllForAdmin()
    {
        return [
            'section' => $this->getSection(),
            'arabic_questions' => $this->getArabicQuestions(),
            'english_questions' => $this->getEnglishQuestions(),
            'user_questions' => $this->getUserQuestions(),
        ];
    }

    /**
     * Get FAQ data for public website
     */
    public function getForPublic($locale = 'ar')
    {
        $section = $this->getSection();
        
        $questions = $locale === 'en' 
            ? FaqQuestionEn::active()->ordered()->get()
            : FaqQuestionAr::active()->ordered()->get();

        return [
            'section' => $section ? [
                'title' => $section->getTitle($locale),
                'subtitle' => $section->getSubtitle($locale),
            ] : null,
            'questions' => $questions->map(function ($q) {
                return [
                    'id' => $q->id,
                    'category' => $q->category,
                    'question' => $q->question,
                    'answer' => $q->answer,
                    'icon' => $q->icon,
                ];
            }),
        ];
    }

    /**
     * Update section settings
     */
    public function updateSection(array $data, int $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            $section = FaqSection::firstOrNew();
            
            $section->fill([
                'title_en' => $data['title_en'],
                'title_ar' => $data['title_ar'],
                'subtitle_en' => $data['subtitle_en'] ?? null,
                'subtitle_ar' => $data['subtitle_ar'] ?? null,
                'updated_by' => $userId,
            ]);
            
            $section->save();
            
            return $section;
        });
    }

    /**
     * Bulk update Arabic questions
     */
    public function bulkUpdateArabicQuestions(array $questions, int $userId)
    {
        return DB::transaction(function () use ($questions, $userId) {
            // Get existing IDs
            $existingIds = collect($questions)
                ->pluck('id')
                ->filter()
                ->toArray();

            // Delete removed questions
            FaqQuestionAr::whereNotIn('id', $existingIds)->delete();

            // Update or create questions
            $updatedQuestions = collect();
            
            foreach ($questions as $index => $questionData) {
                $question = FaqQuestionAr::updateOrCreate(
                    ['id' => $questionData['id'] ?? null],
                    [
                        'category' => $questionData['category'],
                        'question' => $questionData['question'],
                        'answer' => $questionData['answer'],
                        'icon' => $questionData['icon'] ?? '❓',
                        'order' => $index,
                        'is_active' => true,
                        'updated_by' => $userId,
                    ]
                );
                
                $updatedQuestions->push($question);
            }

            return $updatedQuestions;
        });
    }

    /**
     * Bulk update English questions
     */
    public function bulkUpdateEnglishQuestions(array $questions, int $userId)
    {
        return DB::transaction(function () use ($questions, $userId) {
            // Get existing IDs
            $existingIds = collect($questions)
                ->pluck('id')
                ->filter()
                ->toArray();

            // Delete removed questions
            FaqQuestionEn::whereNotIn('id', $existingIds)->delete();

            // Update or create questions
            $updatedQuestions = collect();
            
            foreach ($questions as $index => $questionData) {
                $question = FaqQuestionEn::updateOrCreate(
                    ['id' => $questionData['id'] ?? null],
                    [
                        'category' => $questionData['category'],
                        'question' => $questionData['question'],
                        'answer' => $questionData['answer'],
                        'icon' => $questionData['icon'] ?? '❓',
                        'order' => $index,
                        'is_active' => true,
                        'updated_by' => $userId,
                    ]
                );
                
                $updatedQuestions->push($question);
            }

            return $updatedQuestions;
        });
    }

    /**
     * Mark user question as read
     */
    public function markQuestionAsRead(int $questionId, int $userId)
    {
        $question = UserQuestion::findOrFail($questionId);
        $question->markAsRead($userId);
        
        return $question;
    }

    /**
     * Mark user question as unread
     */
    public function markQuestionAsUnread(int $questionId)
    {
        $question = UserQuestion::findOrFail($questionId);
        $question->markAsUnread();
        
        return $question;
    }

    /**
     * Delete user question
     */
    public function deleteUserQuestion(int $questionId)
    {
        $question = UserQuestion::findOrFail($questionId);
        $question->delete();
        
        return true;
    }

    /**
     * Create user question (from public form)
     */
    public function createUserQuestion(array $data)
    {
        return UserQuestion::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'question' => $data['question'],
        ]);
    }

    /**
     * Get unread count
     */
    public function getUnreadCount()
    {
        return UserQuestion::unread()->count();
    }
}