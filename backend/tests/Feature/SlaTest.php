<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\SlaPolicy;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SlaTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_created_with_sla_policy(): void
    {
        $org = Organization::create(['name' => 'Acme', 'slug' => 'acme', 'plan' => 'pro', 'domain' => 'acme.com']);
        $user = User::create(['name' => 'Admin', 'email' => 'admin@acme.com', 'password' => bcrypt('password'), 'organization_id' => $org->id, 'role' => 'admin']);

        SlaPolicy::create([
            'organization_id' => $org->id,
            'name' => 'Gold SLA',
            'priority' => 'high',
            'response_hours' => 4,
            'resolution_hours' => 24,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/tickets', [
            'title' => 'Urgent system failure',
            'description' => 'Production is down.',
            'priority' => 'high',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', [
            'organization_id' => $org->id,
            'priority' => 'high',
        ]);
    }
}
