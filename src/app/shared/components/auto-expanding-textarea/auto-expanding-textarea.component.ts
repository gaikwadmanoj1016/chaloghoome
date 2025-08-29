import { Component } from '@angular/core';

@Component({
  selector: 'app-auto-expanding-textarea',
  templateUrl: './auto-expanding-textarea.component.html',
  styleUrl: './auto-expanding-textarea.component.scss'
})
export class AutoExpandingTextareaComponent {

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  onEnter(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (event.key === 'Enter') {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent new line on Ctrl + Enter
        textarea.value += '\n';
      } else {
        // Perform regular Enter functionality
        event.preventDefault();
      }
    }
    this.onInput(event);
  }
}
