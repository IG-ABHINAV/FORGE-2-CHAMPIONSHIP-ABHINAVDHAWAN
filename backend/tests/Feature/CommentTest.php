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
        $org = Organization::create(['name' => 'Acme', 'slug' => 'acme', 'plan' => 'pro', 'domain' => 'acme.com']);
        $user = User::create(['name' => 'Agent', 'email' => 'agent@acme.com', 'password' => bcrypt('password'), 'organization_id' => $org->id, 'role' => 'agent']);
        $ticket = Ticket::create(['organization_id' => $org->id, 'user_id' => $user->id, 'title' => 'Test', 'description' => 'Desc', 'status' => 'open', 'priority' => 'low']);

        $response = $this->actingAs($user)->postJson("/api/v1/tickets/{$ticket->id}/comments", [
            'body' => 'This is a test comment.',
            'is_internal' => false,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('comments', ['ticket_id' => $ticket->id, 'body' => 'This is a test comment.']);
    }

    public function test_user_cannot_comment_on_other_org_ticket(): void
    {
        $orgA = Organization::create(['name' => 'OrgA', 'slug' => 'orga', 'plan' => 'pro', 'domain' => 'orga.com']);
        $userA = User::create(['name' => 'UserA', 'email' => 'a@orga.com', 'password' => bcrypt('password'), 'organization_id' => $orgA->id, 'role' => 'agent']);

        $orgB = Organization::create(['name' => 'OrgB', 'slug' => 'orgb', 'plan' => 'pro', 'domain' => 'orgb.com']);
        $userB = User::create(['name' => 'UserB', 'email' => 'b@orgb.com', 'password' => bcrypt('password'), 'organization_id' => $orgB->id, 'role' => 'agent']);
        $ticketB = Ticket::create(['organization_id' => $orgB->id, 'user_id' => $userB->id, 'title' => 'OrgB Ticket', 'description' => 'Desc', 'status' => 'open', 'priority' => 'low']);

        $response = $this->actingAs($userA)->postJson("/api/v1/tickets/{$ticketB->id}/comments", [
            'body' => 'Cross-org attempt.',
        ]);

        $response->assertStatus(404);
    }
}
