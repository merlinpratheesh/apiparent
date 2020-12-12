import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, withLatestFrom, switchMap, filter, tap, take } from 'rxjs/operators';
import { UserdataService } from './service/userdata.service';
import { MatSidenav } from '@angular/material/sidenav';
import { userProfile, projectControls, projectFlags, TestcaseInfo, projectVariables } from './testcaseList/single-testcase/projectTypes';
import { AngularFirestore } from '@angular/fire/firestore';
import { doc } from 'rxfire/firestore';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  myuserProfile: userProfile = {
    userAuthenObj: undefined,
    projectOwner: undefined,
    projectLocation: undefined,
    projectName: undefined,
    membershipType: undefined,
    endMembershipValidity: undefined,
    mainsubsectionKeys: undefined,
    publicProjectData: undefined,
    ownPublicprojectData: undefined,
    MainSectionData: undefined,
    SubSectionData: undefined
  };
  myprojectVariables: projectVariables = {
    testcaseInfodata: undefined,
    initialMainSection: 'MainSection'
  }
  firstTestcaseInfo: TestcaseInfo = {
    heading: 'Select Section',
    subHeading: 'TextArea Empty',
    description: 'Add NewSection',
    stackblitzLink: 'https://www.google.com/'
  };

  myprojectFlags: projectFlags = {
    showCreateTestcase: false,//show add or New Testcase based on number of testcases in subsection
    showPaymentpage: undefined,//for expired user-remove it
    showTestcaseEdit: false,
    homeNewProject: false,
    editDeleteProject: false,
    editAddMainsec: false,
    editDeleteMainsec: false,
    editVisibility: false,
    editAddSubSec: false,
  };
  myprojectControls: projectControls = {
    subsectionkeysControl: new FormControl(),
    
    testcaseInfoControl: new FormControl(),
    createTestcaseControl: new FormControl(),
    publicprojectControl: new FormControl(),
    ownPublicprojectControl: new FormControl(),
    editMainsectionGroup: this.fb.group({
      editMainsectionControl: [{ value: false , disabled: false }]
    }),
    visibilityMainsectionGroup: this.fb.group({
      editVisibilityControl: [{ value: false , disabled: false }]
    }),  
    editSubsectionGroup: this.fb.group({
      editSubsectionControl: [{ value: false , disabled: false }]
    })
  };

  titleDialogRef: MatDialogRef<DialogOverviewExampleDialog>
  @ViewChild('drawer') public sidenav: MatSidenav;
  constructor(
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public testerApiService: UserdataService,
    private db: AngularFirestore,
    public fb: FormBuilder) {
    this.afAuth.authState.pipe(map((authenticationcases: any) => {
      if (authenticationcases) {
        this.myuserProfile.userAuthenObj = authenticationcases;
        this.titleDialogRef.close();
        console.log(authenticationcases);//console
        console.log(authenticationcases.displayName);//console

        return authenticationcases;
      } else {
        this.titleDialogRef.close();
        this.openDialog('loggedout');
        this.myuserProfile.userAuthenObj = null;
        return null;
      }
    }),
      filter(authCredentials => authCredentials !== null),

      map((authCredentialsObj: any) => {
        this.myuserProfile.publicProjectData = doc(this.db.firestore.doc('/projectList/publicProjects')).pipe(
          map((mypublicproject: any) => {
            console.log(mypublicproject.data());//console
            return mypublicproject.data().public;
            
          })
        );

        this.myuserProfile.ownPublicprojectData = doc(this.db.firestore.doc('/projectList/' + this.myuserProfile.userAuthenObj.uid)).pipe(
          map((myprivateproject: any) => {
            if (myprivateproject.data() === undefined) {
              return null;
            }
            console.log(myprivateproject.data());//console
            return myprivateproject.data().ownerRecord;
          })
        );
        this.myuserProfile.mainsubsectionKeys = doc(this.db.firestore.doc('/myProfile/' + this.myuserProfile.userAuthenObj.uid)).pipe(
          switchMap((userprofile: any) => {
            if (userprofile.data() === undefined) {//norecords

              const nextMonth: Date = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              const newItem = {
                MembershipEnd: nextMonth.toDateString(),
                MembershipType: 'Demo',
                projectLocation: '/projectList/DemoProjectKey',
                projectOwner: true,
                projectName: 'Demo'
              };

              this.db.doc<any>('myProfile/' + this.myuserProfile.userAuthenObj.uid).set(newItem);
              this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';
              //write new record
              this.myuserProfile.projectOwner = true;
              this.myuserProfile.projectName = 'Demo';
              this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';
              this.myuserProfile.membershipType='Demo';
              this.myuserProfile.endMembershipValidity = new Date(nextMonth.toDateString());
              this.myprojectFlags.showPaymentpage = false;

            } else {//demo/member
              console.log(userprofile.data());//console

              if (new Date(userprofile.data().MembershipEnd).valueOf() < new Date().valueOf()) {
                if (userprofile.data().MembershipType === 'Demo') {//expired
                  this.myuserProfile.projectOwner = false;//cannot add tc
                  this.myuserProfile.projectName = 'Demo';
                  this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';
                  this.myuserProfile.membershipType='Demo';                  
                  this.myuserProfile.endMembershipValidity = new Date(userprofile.data().MembershipEnd);
                  this.myprojectFlags.showPaymentpage = true;// show only payments Page

                } else {//expired member
                  const nextMonth: Date = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  const newItem = {
                    MembershipEnd: nextMonth.toDateString(),
                    MembershipType: 'Demo',
                    projectLocation: '/projectList/DemoProjectKey',
                    projectOwner: true,
                    projectName: 'Demo'
                  };
                  this.db.doc<any>('myProfile/' + this.myuserProfile.userAuthenObj.uid).set(newItem);
                  //update records as Demo
                  this.myuserProfile.projectOwner = true;
                  this.myuserProfile.projectName = 'Demo';
                  this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';                  
                  this.myuserProfile.membershipType='Demo';                  
                  this.myuserProfile.endMembershipValidity = new Date(nextMonth.toDateString());
                  this.myprojectFlags.showPaymentpage = false;
                }

              } else {
                this.myuserProfile.projectName=userprofile.data().projectName;
                this.myuserProfile.projectOwner=userprofile.data().projectOwner;
                this.myuserProfile.projectLocation= userprofile.data().projectLocation;
                this.myuserProfile.membershipType=userprofile.data().MembershipType;
                this.myuserProfile.endMembershipValidity=new Date(userprofile.data().MembershipEnd);
                this.myprojectFlags.showPaymentpage=false;
              }
            }
            return doc(this.db.firestore.doc(this.myuserProfile.projectLocation)).pipe(take(1), 
            map((values: any) => {
              const mainsubsectionKeys = [];
              console.log(mainsubsectionKeys);//
              let subSectionKeys = [];
              console.log('subsectionKeys',subSectionKeys);//

              let savedisabledval = undefined;
              for (const allmainlist in values.data()) {
                const myval = values.data();
                myval[allmainlist].forEach(singlesublist => {
                  for (const mission in singlesublist) {
                    subSectionKeys.push({ value: mission, viewValue: mission });
                    savedisabledval = singlesublist[mission];
                    console.log('mission',mission);
                  }
                  mainsubsectionKeys.push({
                    name: allmainlist,

                    disabled: savedisabledval,
                    SubSection: subSectionKeys
                  });
                  console.log(mainsubsectionKeys);

                  subSectionKeys = [];
                });
              }
              return mainsubsectionKeys;
            }))
          })
        );
        return authCredentialsObj;
      })).subscribe(afterauthdone => {

      });

  }
  ngOnInit() {
    this.openDialog('loggingin');
  }
  drawerclose() {
    this.sidenav.close();
  }
  draweropen() {

  }

  componentLogOff() {
    this.openDialog('loggedout');
    this.myuserProfile.userAuthenObj = undefined;
    this.testerApiService.logout();
  }
  openDialog(status: string): void {
    this.titleDialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: status
    });

    this.titleDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <div *ngIf="data === 'loggedout'"  style="color:blue; padding:0px;" >
  <div fxLayout="column" fxLayoutAlign="space-around center" style="letter-spacing: 20px;">
  <h1> <strong style="font-size:30px">Testing tool</strong> </h1>
  <h1>  Checkout various Public projects TestCases </h1>
  <h1>  Also Edit/Create/Delete Testcases in Demo Mode </h1>
  </div>
  <div fxLayout="row " fxLayoutAlign="space-around center">
    <mat-chip-list>
    <mat-chip  style="font-size:2em; padding:10px;height: 60px !important;
    " >Login now:</mat-chip>
    </mat-chip-list>
    <button mat-raised-button color="primary" (click)="testerApiService.login()"> Google login</button>
  </div>
  </div>
  <mat-spinner  *ngIf="data !== 'loggedout'"></mat-spinner>
  `
})
export class DialogOverviewExampleDialog {
  mydata = 'showspinner';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string, public testerApiService: UserdataService) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
