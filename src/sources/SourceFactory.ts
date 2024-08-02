import { LinkedIn } from "./Linkedin";
import { SourceBase } from "./SourceBase";

export enum SourceType {
  LinkedIn
};


// interface SourceFactoryOptions {

// }

// TODO: maybe this should hard coded types that are accepted. I need to figure out a common patterns that each source would share for options
export type SourceFactoryOptions = { [option: string]: string; };

// store in memory so we wont have to create another class
// const sources: {[s: string]: SourceBase } = {}

export class SourceFactory {
  static createSource(type: SourceType, options?: SourceFactoryOptions): SourceBase {
    switch (type) {
      case SourceType.LinkedIn:
        if (options && 'keyword' in options && 'location' in options) {
          return new LinkedIn(options.keyword, options.location);
        } else {
          throw new Error(`Invalid options for ${type}`);
        }
      default:
        throw new Error(`${type} - not yet implemented`);
    }
  }
}
