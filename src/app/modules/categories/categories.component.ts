import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  topCategories: any[] = [];
  topCategoriesData: any[] = [];

  constructor(private apiRequest: ApiService, public commonService: CommonService) { }
  ngOnInit(): void {
    this.getTopCategoriesWithPosts();
  }

  private getTopCategoriesWithPosts() {
    const limit = 5;
    this.apiRequest.getTopCategories(limit).subscribe({
      next: (res: any) => {
        if (res.result && res.data?.length > 0) {
          this.fetchPostsForCategories(res.data);
        }
      },
      error: (err) => {
        console.error("❌ Error fetching categories", err);
      }
    });
  }

  private fetchPostsForCategories(categories: any[]) {
    const requests = categories.map(cat =>
      this.getPostsByCategoryName(cat.catName)
    );

    forkJoin(requests).subscribe({
      next: (results: any) => {
        this.topCategoriesData = results;
      },
      error: (err) => {
        console.error("❌ Error fetching posts by category", err);
      }
    });
  }

  private getPostsByCategoryName(catName: string) {
    const slugifiedName = catName.split(' ').join('_');

    return this.apiRequest.getAllplacesByCategory(slugifiedName).pipe(
      map((response: any) => ({
        catName: catName,
        slugifiedCatName: catName.split(' ').join('_'),
        items: this.mapUniquePosts(response.data || [])
      }))
    );
  }

  private mapUniquePosts(posts: any[]): any[] {
    const seen = new Set<string>();
    const uniquePosts = [];

    for (const post of posts) {
      if (!seen.has(post.postName)) {
        seen.add(post.postName);
        uniquePosts.push({
          postName: post.postName,
          location: post.location,
          slugifiedPostName: post.slugifiedPostName,
          imageUrl: post.thumbnailImg
            ? this.commonService.appendAssetUrl(post.thumbnailImg)
            : 'assets/imgs/image-placeholder.jpg',
          summary: post.summary || ''
        });
      }
    }

    return uniquePosts;
  }

}
