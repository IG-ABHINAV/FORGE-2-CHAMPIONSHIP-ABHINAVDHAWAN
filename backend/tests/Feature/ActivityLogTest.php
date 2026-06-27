<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_mutations_are_logged_to_activity_logs(): void
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'agent']);

        // Create ticket
        $response = $this->actingAs($user)->postJson('/api/v1/tickets', [
            'title' => 'Logging Test Ticket',
            'description' => 'Test',
            'priority' => 'low',
        ]);

        $response->assertStatus(201);
        $ticketId = $response->json('id');

        $this->assertDatabaseHas('activity_logs', [
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'action' => 'created',
            'entity_type' => Ticket::class,
            'entity_id' => $ticketId,
        ]);
    }
}
