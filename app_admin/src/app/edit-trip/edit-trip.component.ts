import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something went wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);

    // Initialize the form
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

  // Fetch the trip data
  this.tripDataService.getTrip(tripCode).subscribe({
    next: (value: any) => {
      // Check if the value is falsy (null, undefined, or empty)
      if (!value) {
        this.message = 'No Trip Retrieved!';
        console.log(this.message);
        return;
      }

      // Format the start date properly before patching to the form
      if (value.start) {
        value.start = this.formatDate(value.start);  // Apply the date format
      }

      // If value is an array, patch with the first element, else patch directly
      this.trip = value;
      this.editForm.patchValue(value[0] || value); 

      this.message = 'Trip: ' + tripCode + ' retrieved';
      console.log(this.message);
    },
    error: (error: any) => {
      console.log('Error: ' + error);
      this.message = 'Failed to retrieve trip data.';
    }
  });
}

// Helper function to format date to yyyy-MM-dd
private formatDate(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');  // Month is 0-based
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

  public onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  // Quick access to form fields
  get f() { return this.editForm.controls; }
}
