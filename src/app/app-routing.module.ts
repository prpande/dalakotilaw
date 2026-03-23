import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { PracticesComponent } from './components/practices/practices.component';
import { ContactComponent } from './components/contact/contact.component';
import { FaqsComponent } from './components/faqs/faqs.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "blog",
    component: BlogComponent,
    pathMatch: 'full'
  },
  {
    path: "blog/:slug",
    component: BlogPostComponent
  },
  {
    path: "practices",
    component: PracticesComponent
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "faqs",
    component: FaqsComponent
  },
  {
    path: "**",
    redirectTo: "/home"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
