import { Component, Inject, OnInit} from '@angular/core';
import {JsonplaceholderService} from "./services/jsonplaceholder.service";
import {interval, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public usersPosts$: Observable<any>;
  public posts: Array<any>;
  public currentDialogPostIndex: number = 0;

  private dialogRef: MatDialogRef<Dialog, any>;

  constructor(private jsonplaceholderService: JsonplaceholderService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAllPostsInterval();
    this.fetchPosts();

  }

  private fetchAllPostsInterval() {
    this.usersPosts$ = this.fetchAllPosts();
    interval(60000).subscribe((x) => {
      this.usersPosts$ = this.fetchAllPosts();
    });
  }

  private fetchAllPosts(): Observable<any> {
    return this.jsonplaceholderService.getAllPosts().pipe(
        map((posts: Array<any>) => {
          return posts.reduce((prev, current) => {
            if (prev.find(u => u.userId === current.userId)) {
              return prev.map(user => {
                if (user.userId === current.userId) {
                  return {
                    ...user,
                    posts: [...user.posts, current]
                  }
                } else {
                  return user;
                }
              });
            } else {
              return [
                  ...prev,
                {
                  userId: current.userId,
                  posts: [current]
                }
              ]
            }
          }, [])
        })
    );
  }

  private fetchPosts() {
    this.jsonplaceholderService.getAllPosts().subscribe(posts => this.posts = posts);
  }

  private openDialog() {
    this.dialogRef = this.dialog.open(Dialog, {
      width: '450px',
      data: {
        title: `${this.posts[this.currentDialogPostIndex].id} ${this.posts[this.currentDialogPostIndex].title}`,
        body: this.posts[this.currentDialogPostIndex].body
      }
    });
  }

  private handleDialogClose() {
    this.dialogRef.afterClosed().subscribe(result => {
      this.currentDialogPostIndex = this.currentDialogPostIndex + 1;
    });
  }

  public onShowPostsClick() {
    this.openDialog();
    this.handleDialogClose();
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  constructor(
      public dialogRef: MatDialogRef<Dialog>,
      @Inject(MAT_DIALOG_DATA) public data: {title: string; body: string}
  ) {
  }
}
