import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(url: string){
    return this.sanitizer.bypassSecurityTrustHtml(url);
    // return this.sanitizer.sanitize(SecurityContext.URL, url);
    // this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

}
