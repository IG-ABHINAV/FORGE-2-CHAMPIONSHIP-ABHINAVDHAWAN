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

    public function test_ticket_creation_is_logged(): void
    {
        $org = Organization::create(['name' => 'Acme', 'slug' => 'acme', 'plan' => 'pro', 'domain' => 'acme.com']);
        $user = User::create(['name' => 'Agent', 'email' => 'agent@acme.com', 'password' => bcrypt('password'), 'organization_id' => $org->id, 'role' => 'agent']);

        $response = $this->actingAs($user)->postJson('/api/v1/tickets', [
            'title' => 'Logging Test Ticket',
            'description' => 'Test',
            'priority' => 'low',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('activity_logs', [
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'action' => 'ticket_created',
        ]);
    }
}
