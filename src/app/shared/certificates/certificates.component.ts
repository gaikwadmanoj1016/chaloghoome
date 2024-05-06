import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-certificates',
  standalone: false,
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  @Output() toggelModal: EventEmitter<any> = new EventEmitter();

  certificates = [
    { name: 'Rappling', url: 'assets/imgs/certificate-1.jpg' },
    { name: 'Climbing', url: 'assets/imgs/certificate-2.jpg' },
    { name: 'Guide', url: 'assets/imgs/certificate-3.jpg' },
  ]
  certificate: any;

  constructor() { }

  ngOnInit(): void {
    this.certificate = this.certificates[0]

  }
  closeModal() {
    this.toggelModal.emit(false);
  }

  public openCertificate(item: any) {
    this.certificate = item;
  }
}
