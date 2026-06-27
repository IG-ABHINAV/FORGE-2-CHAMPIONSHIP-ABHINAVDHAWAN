<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_comment_to_own_ticket(): void
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'agent']);
        $ticket = Ticket::factory()->create(['organization_id' => $org->id, 'user_id' => $user->id]);

        $response = $this->actingAs($user)->postJson("/api/v1/tickets/{$ticket->id}/comments", [
            'body' => 'This is a test comment.',
            'is_internal' => false,
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment(['body' => 'This is a test comment.']);
        $this->assertDatabaseHas('comments', ['ticket_id' => $ticket->id, 'body' => 'This is a test comment.']);
    }

    public function test_user_cannot_comment_on_other_org_ticket(): void
    {
        $orgA = Organization::factory()->create();
        $userA = User::factory()->create(['organization_id' => $orgA->id, 'role' => 'agent']);

        $orgB = Organization::factory()->create();
        $ticketB = Ticket::factory()->create(['organization_id' => $orgB->id]);

        $response = $this->actingAs($userA)->postJson("/api/v1/tickets/{$ticketB->id}/comments", [
            'body' => 'Attempting cross-org comment.',
        ]);

        $response->assertStatus(403);
    }
}
