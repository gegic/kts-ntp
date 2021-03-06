import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CulturalOffering} from '../../core/models/cultural-offering';
import {Router} from '@angular/router';
import {CulturalOfferingsService} from '../../core/services/cultural-offerings/cultural-offerings.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../core/services/auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.scss']
})
export class ListElementComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @Input()
  culturalOffering!: CulturalOffering;
  @Input()
  index = 0;
  @Output()
  offeringDeleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
              private culturalOfferingsService: CulturalOfferingsService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  getThumbnailUrl(): string {
    return `/photos/main/thumbnail/${this.culturalOffering?.photoId ?? -1}.png`;
  }

  onClickCard(): void {
    this.router.navigate([`/cultural-offering/${this.culturalOffering.id}`]);
  }

  onClickViewMap(): void {
    this.router.navigate([''],
      {queryParams: {lat: this.culturalOffering.latitude, lng: this.culturalOffering.longitude}});
  }

  onClickDelete(event: any): void {
    event.stopPropagation();
    this.confirmationService.confirm(
      {
        message: `Are you sure that you want to delete ${this.culturalOffering?.name ?? ''}`,
        acceptLabel: 'Delete',
        rejectLabel: 'Close',
        header: 'Deletion',
        icon: 'pi pi-trash',
        acceptButtonStyleClass: 'confirm-deletion',
        accept: () => this.deletionConfirmed()
      });
  }

  onClickEdit(event: any): void {
    event.stopPropagation();
    this.router.navigate([`/edit-offering/${this.culturalOffering?.id ?? 0}`]);
  }

  onClickSubscribe(event: any): void {
    event.stopPropagation();
    if (!this.isLoggedIn()) {
      this.router.navigate(['login']);
    } else {
      this.subscriptions.push(
        this.culturalOfferingsService.subscribe(this.authService.user.getValue()?.id ?? 0,
          this.culturalOffering.id ?? 0).subscribe(data => {
            this.culturalOffering = data;
        })
      );
    }
  }

  onClickUnsubscribe(event: any): void {
    event.stopPropagation();
    this.subscriptions.push(
      this.culturalOfferingsService.unsubscribe(this.authService.user.getValue()?.id ?? 0,
        this.culturalOffering.id ?? 0).subscribe(data => {
          this.culturalOffering = data;
      })
    );
  }

  deletionConfirmed(): void {
    this.subscriptions.push(
      this.culturalOfferingsService.delete(this.culturalOffering?.id ?? 0).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted successfully',
          detail: 'The cultural offering was deleted successfully',
          id: 'deletion-successful'
        });
        this.offeringDeleted.emit();
      })
    );
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserRole(): string {
    return this.authService.getUserRole();
  }

  get reviews(): string {
    if (this.culturalOffering?.numReviews === 0) {
      return 'No reviews so far.';
    } else {
      return `${(Math.round((this.culturalOffering?.overallRating ?? 0) * 10) / 10).toFixed(1)} rating out of ${this.culturalOffering?.numReviews} reviews.`;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
