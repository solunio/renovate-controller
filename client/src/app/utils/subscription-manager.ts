import {Observable, Subject, Subscription} from 'rxjs';


export class SubscriptionManager {
    public unregistered$: Observable<Subscription>;
    public registered$: Observable<Subscription>;

    private subscriptions: Subscription[];
    private unregisteredSubject: Subject<Subscription>;
    private registeredSubject: Subject<Subscription>;

    constructor() {
        this.subscriptions = [];
        this.unregisteredSubject = new Subject<Subscription>();
        this.unregistered$ = this.unregisteredSubject.asObservable();
        this.registeredSubject = new Subject<Subscription>();
        this.registered$ = this.registeredSubject.asObservable();
    }

    public registerSubscription(subscription: Subscription): void {
        // only add subscription if not already completed or unsubscribed
        if (subscription.closed) { return; }

        // add subscription to list
        this.subscriptions.push(subscription);
        this.registeredSubject.next(subscription);

        // automatically remove subscription if completed or unsubscribed
        subscription.add(() => {
            const index = this.subscriptions.indexOf(subscription);
            if (index > -1) {
                this.subscriptions.splice(index, 1);
                this.unregisteredSubject.next(subscription);
            } else {
                console.error(`Unable to remove registered subscription at index ${index}!`);
            }
        });
    }

    public unsubscribeAll() {
        // NOTE: clone subscriptions array before unsubscribung, since subscriptions
        // will automatically delete themselves from the subscriptions array when
        // unsubscribed -> forEach no longer works propperly
        [...this.subscriptions].forEach(subscription => subscription.unsubscribe());
    }

    public get size(): number {
        return this.subscriptions.length;
    }
}
