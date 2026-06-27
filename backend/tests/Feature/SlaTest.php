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

    public function test_sla_due_at_calculated_on_ticket_creation(): void
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id]);

        SlaPolicy::create([
            'organization_id' => $org->id,
            'name' => 'Gold SLA',
            'priority' => 'high',
            'response_hours' => 4,
            'resolution_hours' => 24,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/tickets', [
            'title' => 'Urgent system failure',
            'description' => 'Production is down completely.',
            'priority' => 'high',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', [
            'organization_id' => $org->id,
            'priority' => 'high',
        ]);

        $ticket = Ticket::first();
        $this->assertNotNull($ticket->sla_due_at);
    }
}
