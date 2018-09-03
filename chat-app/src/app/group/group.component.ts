import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UsersService } from '../users.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupName:string = '';
  username:string = '';
  channels; // list of channels for users with no admin roles

  isGroupAdmin = false;
  isSuperAdmin = false;

  createChannelName:string = '';

  userData;

  allChannels; // list of channels for users with admin roles

  testSuperAdmin = false;

  allUsers; // all users that exist in this group

  allUserData; // the data of all users

  newUsername:string = '';

  constructor(private router:Router, private usersService:UsersService) { 
    this.groupName = localStorage.getItem('currentGroup');
    this.username = localStorage.getItem('username');
    this.getUser();
    this.getGroupUsers();
  }

  getUser() {
    this.usersService.getUser(this.username).subscribe(
      data => {
        this.userData = data;
        console.log('Setting user data');
        this.isGroupAdmin = this.userData.groupAdmin;
        this.isSuperAdmin = this.userData.superAdmin;
        this.testSuperAdmin = this.userData.superAdmin;
        console.log(data);
        console.log(`\tThis user is a group admin: ${this.isGroupAdmin}`);
        console.log(`\tThis user is a super admin: ${this.isSuperAdmin}`);
         // update channels list
        this.userData.groups.forEach(group => {
          if(group.name === this.groupName) {
            this.channels = group.channels;
          }
        });
        this.getChannels();
        this.getDataAllUsers();
      },
      err => {
        console.error
      },
      () => {
        console.log('\tUser retrieved')
        console.log(this.userData);
      }
    );
  }

  ngOnInit() {
  
  }

  logOut() {
    this.router.navigateByUrl('/');
  }

  viewChannel(channel) {
    console.log(`Viewing channel ${channel}`);
    localStorage.setItem('currentChannel', channel);
    this.router.navigateByUrl('/channel');
  }

  createChannel() {
    if(this.createChannelName === '') {
      alert('New channel name cannot be empty');
      return;
    }
    console.log(`Creating new channel ${this.createChannelName}`);
    this.usersService.createChannel(this.username, this.groupName, this.createChannelName).subscribe(
      data => {
        console.log('New list of channels received');
        console.log(data);
        this.allChannels = data;
      },
      err => {
        console.error;
      },
      () => {
        console.log(`Creating new channel ${this.createChannelName} completed`);
      }
    );
  }

  removeChannel(channel) {
    if(channel === 'general') {
      alert(`Cannot remove default channel ${channel}`);
      return;
    }
    console.log(`Removing channel ${channel}`);
    this.usersService.removeChannel(this.username, this.groupName, channel).subscribe(
      data => {
        console.log(`New list of channels received`);
        console.log(data);
        this.allChannels = data;
      },
      err => {
        console.error;
      },
      () => {
        console.log(`Removing channel ${channel} completed`);
      }
    );
  }

  getChannels() {
    // console.log(`Group admin: ${this.isGroupAdmin} Super admin: ${this.isSuperAdmin}`);
    if(this.isGroupAdmin || this.isSuperAdmin) {
      console.log('Admin fetching all channels');
      this.usersService.getChannels(this.groupName).subscribe(
        data => {
          console.log('Received data for all channels');
          console.log(data);
          this.allChannels = data;
        },
        err => {
          console.error;
        },
        () => {
          console.log('Admin has finished fetching all channels');
        }
      );
    }
  }

  getGroupUsers() {
    console.log(`Function: Getting users for group ${this.groupName}`);
    this.usersService.getGroupUsers(this.groupName).subscribe(
      data => {
        console.log(`\tReceived response data from GET: `);
        console.log(data);
        this.allUsers = data;
      },
      err => {
        console.error;
      },
      () => {
        console.log('\tCompleted GET request of group users');
      }
    );
  }

  getDataAllUsers() {
    if(!this.isGroupAdmin) return;
    console.log('Getting all user data from server');
    this.usersService.getDataAllUsers().subscribe(
      data => {
        console.log('Received all user data from server');
        console.log(data);
        this.allUserData = data;
      },
      err => {
        console.error;
      },
      () => {
        console.log('Completed getting all user data from server');
      }
    );
  }

  removeUser(user:string) {
    if(this.groupName === 'newbies' || this.groupName === 'general') {
      alert('Cannot remove users in this default channel');
      return;
    }
    if(user === this.username) {
      alert('Cannot remove yourself');
      return;
    }
    // check if they are an admin, if not, then proceed
    if(this.allUserData[user].groupAdmin) {
      alert(`Cannot remove admin user ${user}`);
      return;
    }
    console.log(`Removing user ${user}`);
    this.usersService.removeUserInGroup(user, this.groupName).subscribe(
      data => {
        console.log('Received new list of users');
        console.log(data);
        this.allUsers = data;
      },
      err => {
        console.error;
      },
      () => {
        console.log(`\tFinished removing user ${user}`);
      }
    );
  }

  addUserToGroup() {
    if(this.allUsers.includes(this.newUsername)) {
      alert(`User ${this.newUsername} is already in the group`);
      return;
    }
    console.log(`Adding new user ${this.newUsername} to group`);
  }
}
