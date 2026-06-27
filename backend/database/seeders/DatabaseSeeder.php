<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\SlaPolicy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $orgNames = ['Stark Industries', 'Wayne Enterprises', 'Acme Corp'];

        foreach ($orgNames as $name) {
            $slug = Str::slug($name);

            $org = Organization::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'plan' => 'pro',
                    'domain' => $slug . '.pulsedesk.com',
                ]
            );

            // Seed SLA Policy
            SlaPolicy::updateOrCreate(
                ['organization_id' => $org->id, 'name' => 'Standard Policy', 'priority' => 'high'],
                [
                    'response_hours' => 4,
                    'resolution_hours' => 24,
                ]
            );

            // Seed Users
            $adminEmail = $name === 'Acme Corp' ? 'admin@acme.test' : strtolower($slug) . '-admin@pulsedesk.com';
            $agentEmail = $name === 'Acme Corp' ? 'agent@acme.test' : strtolower($slug) . '-agent@pulsedesk.com';
            $password = $name === 'Acme Corp' ? 'password' : 'password123';

            $admin = User::updateOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => "Admin User ({$name})",
                    'password' => Hash::make($password),
                    'organization_id' => $org->id,
                    'role' => 'admin',
                ]
            );

            $agent = User::updateOrCreate(
                ['email' => $agentEmail],
                [
                    'name' => "Agent User ({$name})",
                    'password' => Hash::make($password),
                    'organization_id' => $org->id,
                    'role' => 'agent',
                ]
            );

            if ($name === 'Acme Corp') {
                User::updateOrCreate(
                    ['email' => 'customer@acme.test'],
                    [
                        'name' => 'Acme Customer',
                        'password' => Hash::make('password'),
                        'organization_id' => $org->id,
                        'role' => 'customer',
                    ]
                );

                User::whereIn('email', ['acme-corp-admin@pulsedesk.com', 'acme-corp-agent@pulsedesk.com'])->delete();
            }

            // Seed Tickets
            if (!Ticket::where('organization_id', $org->id)->exists()) {
                for ($i = 1; $i <= 15; $i++) {
                    Ticket::create([
                        'title' => "Sample Ticket #{$i} for {$name}",
                        'description' => "This is the description for sample support ticket number {$i}.",
                        'status' => $i % 3 == 0 ? 'in_progress' : ($i % 5 == 0 ? 'resolved' : 'open'),
                        'priority' => $i % 4 == 0 ? 'urgent' : ($i % 3 == 0 ? 'high' : 'medium'),
                        'organization_id' => $org->id,
                        'user_id' => $admin->id,
                        'assignee_id' => $agent->id,
                        'sla_breached' => $i % 7 == 0,
                    ]);
                }
            }
        }
    }
}
