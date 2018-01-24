// @flow
import Client from 'swarm-client';
import Op, {Frame, ZERO} from 'swarm-ron';
import type {Options as ClntOpts} from 'swarm-client';

type Options = {
  ...ClntOpts,
};

export default class API {
  client: Client;
  options: Options;

  constructor(options: Options) {
    this.client = new Client(((options: any): ClntOpts));
  }

  async ensure(): Promise<void> {
    await this.client.ensure();
  }

  async push(input: string, payload: {} | Array<mixed> | void): Promise<string> {
    await this.ensure();
    let header = Op.fromString(input);

    if (!header || (header && header.uuid(0).eq(ZERO.uuid(0)) && header.uuid(1).eq(ZERO.uuid(1)))) {
      throw new Error('Empty ID is not allowed');
    }

    if (header.uuid(1).eq(ZERO.uuid(1))) {
      header = new Op(
        header.uuid(0),
        // $FlowFixMe
        this.client.clock.time(),
        header.uuid(2),
        header.uuid(3),
        header.values,
        header.term,
      );
    }

    const frame = new Frame();
    // TODO
    await this.client.push(frame.toString());
    return header.uuid(1).toString();
  }
}
