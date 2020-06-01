import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FileRepositoryService {
	private scopes: { [scope: string]: Array<File> } = {};

	scope(scope: string) {
		if (!this.scopes[scope]) {
			this.scopes[scope] = [];
		}

		return this.scopes[scope];
	}
}
